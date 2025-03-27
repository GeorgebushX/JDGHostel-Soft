import mongoose from 'mongoose';

const studentFeeSchema = new mongoose.Schema({
  admission_id: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Admission',
  },
  HostelFee: {
    type: Number,
    required: true,
    min: 0, // Ensuring fee cannot be negative
  },
  amountPaid: {
    type: Number,
    required: true,
    min: 0, // Payment cannot be negative
    validate: {
      validator: function (value) {
        return value <= this.HostelFee; // Prevents overpayment
      },
      message: "Amount paid cannot exceed total hostel fee.",
    },
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending",
  },
  dueAmount: {
    type: Number,
    default: function () {
      return this.HostelFee - this.amountPaid; // Auto-calculate due amount
    },
    min: 0, // Ensures due amount is never negative
  },
  dueDate: {
    type: Date,
    required: true,
  },
  paymentDate: {
    type: Date,
  },
  paymentMethod: {
    type: String,
    enum: ["Cash", "Online"],
  },
  isPaymentCancelled: {  
    type: Boolean,  
    default: false, 
  },
  receipt: { type: String }, // Path to receipt PDF
}, { timestamps: true });

/** 
 * ✅ Middleware to update paymentDate when payment is made
 */
studentFeeSchema.pre('save', function (next) {
  if (this.isModified('amountPaid') && this.amountPaid > 0) {
    this.paymentDate = new Date(); // Set payment date to current timestamp
  }

  // Automatically update payment status based on full payment
  if (this.amountPaid >= this.HostelFee) {
    this.paymentStatus = "Paid";
    this.dueAmount = 0; 
  } else {
    this.paymentStatus = "Pending";
    this.dueAmount = this.HostelFee - this.amountPaid;
  }

  next();
});

const StudentFee = mongoose.model('StudentFee', studentFeeSchema);

export default StudentFee;
